# Song Library

Song Library is a small catalogue for managing song records and viewing aggregate statistics about the catalogue.

## Language

**Song Library**:
A collection of song records managed by the application.
_Avoid_: Music app, streaming app, playlist app, audio platform

**Song**:
A single catalogue entry with a title, artist, album, genre, and optional artwork URL.
_Avoid_: Track, audio file, master recording

**Artist**:
The performer or creator credited on a Song. An Artist is represented by the artist name on Song records, not as a separately managed catalogue entry.
_Avoid_: Musician profile, creator account

**Album**:
The release or collection name associated with a Song. An Album is represented by the album name on Song records, not as a separately managed catalogue entry.
_Avoid_: Release entity, record

**Genre**:
The musical category assigned to a Song. A Genre is represented by the genre name on Song records, not as a separately managed catalogue entry.
_Avoid_: Category entity, tag

**Artwork URL**:
An optional image URL associated with a Song for catalogue presentation. Artwork URL is metadata only; it does not imply audio playback or a separately managed Album entity.
_Avoid_: Audio asset, cover entity, album cover asset, cover URL

**Duration**:
The required length value recorded on a Song for catalogue presentation. Duration is Song metadata and does not imply that the Song Library stores or plays audio.
_Avoid_: Playback position, audio file length, player state

## Example Dialogue

Developer: "Should a Song include an uploaded audio file?"
Domain expert: "No. A Song is only a catalogue entry in the Song Library."

Developer: "Should we create separate Artist, Album, and Genre records?"
Domain expert: "No. Those are names recorded on Songs and summarized through statistics."

Developer: "Does artwork mean the Song Library is becoming a streaming app?"
Domain expert: "No. Artwork is optional catalogue presentation metadata; the Song still has no audio file or playback data."

Developer: "Can we use the prototype's player-style visual layout?"
Domain expert: "Yes, but the language and behavior still describe selecting and managing Songs, not playing tracks."

Developer: "Can a Song have a duration?"
Domain expert: "Yes. Duration is required metadata on the Song record, not evidence that the Song Library stores audio or supports playback."
