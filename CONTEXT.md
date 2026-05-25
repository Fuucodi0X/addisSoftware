# Song Library

Song Library is a small catalogue for managing song records and viewing aggregate statistics about the catalogue.

## Language

**Song Library**:
A collection of song records managed by the application.
_Avoid_: Music app, streaming app, playlist app

**Song**:
A single catalogue entry with a title, artist, album, and genre.
_Avoid_: Track, audio file

**Artist**:
The performer or creator credited on a Song. An Artist is represented by the artist name on Song records, not as a separately managed catalogue entry.
_Avoid_: Musician profile, creator account

**Album**:
The release or collection name associated with a Song. An Album is represented by the album name on Song records, not as a separately managed catalogue entry.
_Avoid_: Release entity, record

**Genre**:
The musical category assigned to a Song. A Genre is represented by the genre name on Song records, not as a separately managed catalogue entry.
_Avoid_: Category entity, tag

## Example Dialogue

Developer: "Should a Song include an uploaded audio file?"
Domain expert: "No. A Song is only a catalogue entry in the Song Library."

Developer: "Should we create separate Artist, Album, and Genre records?"
Domain expert: "No. Those are names recorded on Songs and summarized through statistics."
