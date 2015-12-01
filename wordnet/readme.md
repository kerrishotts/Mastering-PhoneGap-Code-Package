# WordNet Specifics

The full WordNet dictionary is quite large -- on the order of nearly half a gigabyte when not compressed. We don't need most of this
data, and so this document will describe the steps I took to filter it down into something usable for the demo app's purposes.

## Get the full dictionary

Download from <http://sourceforge.net/projects/wnsql/files/wnsql3/sqlite/3.1_snapshot/sqlite-31_snapshot.db.zip/download> and
decompress into a directory of your choosing. You should have a `sqlite-31.db` file that is nearly half a gigabyte in size.

## Get a JSON representation

I executed the following SQL query against the database using `sqlite3`:

```sql
.mode list
.separator ;
.output wordnet.json
select '[' || group_concat(items, ", " || char(10)) || ']'
from (
  select '{' || group_concat('"' || lemma ||'": [' || wordOrder || ']', ", " || char(10) ) || '}' items
  from (
    select lemma, group_concat('"' || synsetid || '"', ", ") wordOrder from (
      select w.lemma, p.posname, s.sensenum, s.synsetid
        from words w, senses s, synsets syn, postypes p
      where 1=1
        and s.wordid = w.wordid
        and syn.synsetid = s.synsetid
        and syn.pos = p.pos
      order by 1,2,3,4
    ) group by 1
  )
  UNION
  select '[' || group_concat(JSON, ',' || char(10)) || ']' items from
  (
    select '{"wordNetRef": "' || wordNetRef || '", "lemmas": [' || lemmas || '], "partOfSpeech": "' ||
            partOfSpeech || '", "semantics": "' || semantics || '",' || char(10) ||
            ' "gloss": "' || gloss || '"}' as JSON from
    (
      select syn.synsetid as wordNetRef,
            group_concat('"' || lemma || '"',', ') as lemmas,
            p.posname as partOfSpeech,
            lexdomainname as semantics,
            definition as gloss
        from words w, senses s, synsets syn, lexdomains l, postypes p
      where 1=1
        and s.wordid = w.wordid
        and syn.synsetid = s.synsetid
        and l.lexdomainid = syn.lexdomainid
        and syn.pos = p.pos
      group by 1,3,4,5
      order by 1
    )
  )
);
.exit
```

This results in about a 28MiB JavaScript object that contains an index and definitions.

## Get a SQLite representation

We can use a portion of the query that generates the JSON representation to obtain a SQLite database. Although the result is not smaller (it's larger by nearly 20MiB), it's much more flexible and speedy.

```sql
sqlite3 /path/to/sqlite-31.db
attach './wordnet.db' as WD;
create table WD.lemmas as
    select wordid, lemma
      from words;
create table WD.senses as
    select w.wordid, s.sensenum, p.posname
      from words w, senses s, synsets syn, postypes p
     where s.wordid = w.wordid
       and syn.synsetid = s.synsetid
       and syn.pos = p.pos;
create table WD.definitions as
    select w.wordid as wordid,
           syn.synsetid as wordNetRef,
           p.posname as partOfSpeech,
           lexdomainname as semantics,
           definition as gloss
      from words w, senses s, synsets syn, lexdomains l, postypes p
     where 1=1
       and s.wordid = w.wordid
       and syn.synsetid = s.synsetid
       and l.lexdomainid = syn.lexdomainid
       and syn.pos = p.pos;
.exit
sqlite3 ./wordnet.db
create view words as
    select wordNetRef,
           group_concat(lemma,'||') as lemmas,
           partOfSpeech,
           semantics,
           gloss
      from lemmas l, definitions d
     where l.wordid = d.wordid
    group by 1,3,4,5
    order by 1;
create unique index pk_lemmas on lemmas ( wordid );
create index idx_lemmas on lemmas ( lemma );
create unique index pk_senses on senses ( wordid, sensenum, posname );
create index idx_senses on senses ( wordid );
create index pk_definitions on definitions ( wordNetRef );
create index idx_definitions on definitions ( wordid );
.exit
```


