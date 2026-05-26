import mongoose from "mongoose";
import { config } from "./config.js";
import { Song, type SongAttrs } from "./songs/song.js";

const artwork = {
  asterEbo: "https://coverartarchive.org/release/18c95806-c70a-4e3e-8fc5-8996b7fbb733/front-250",
  asterKabu: "https://coverartarchive.org/release/9d51ef7e-1df7-4aec-80ca-0d93ab7cb03c/front-250",
  mahmoudAlmaz:
    "https://coverartarchive.org/release/b3da2be6-563f-48f0-a278-130dac836dea/front-250",
  mulatuEthiopiques:
    "https://coverartarchive.org/release/f85a03b1-efb8-4558-86ac-f23945a94853/front-250",
  mulatuPlays:
    "https://coverartarchive.org/release/af240304-3721-4f89-9cba-14e9676bcf7d/front-250"
} as const;

const seedDurations = ["3:42", "4:08", "2:57", "5:14", "3:35"] as const;

const seedSongMetadata: Array<Omit<SongAttrs, "duration"> & { duration?: string }> = [
  {
    title: "Tizita",
    artist: "Tilahun Gessesse",
    album: "Ethiopian Classics",
    genre: "Ethio-jazz",
    artworkUrl: null
  },
  {
    title: "Yekermo Sew",
    artist: "Mulatu Astatke",
    album: "Ethiopiques, Vol. 4",
    genre: "Ethio-jazz",
    artworkUrl: artwork.mulatuEthiopiques
  },
  {
    title: "Kulun",
    artist: "Mulatu Astatke",
    album: "Mulatu Plays Mulatu",
    genre: "Ethio-jazz",
    artworkUrl: artwork.mulatuPlays
  },
  {
    title: "Netsanet",
    artist: "Mulatu Astatke",
    album: "Mulatu Plays Mulatu",
    genre: "Ethio-jazz",
    artworkUrl: artwork.mulatuPlays
  },
  {
    title: "Azmari",
    artist: "Mulatu Astatke",
    album: "Mulatu Plays Mulatu",
    genre: "Ethio-jazz",
    artworkUrl: artwork.mulatuPlays
  },
  {
    title: "Ambassel",
    artist: "Aster Aweke",
    album: "Aster",
    genre: "Pop",
    artworkUrl: null
  },
  {
    title: "Yedi Gosh (My Guy)",
    artist: "Aster Aweke",
    album: "Kabu",
    genre: "Pop",
    artworkUrl: artwork.asterKabu
  },
  {
    title: "Yaz-oh (Grab It, Get It On)",
    artist: "Aster Aweke",
    album: "Kabu",
    genre: "Pop",
    artworkUrl: artwork.asterKabu
  },
  {
    title: "Kabu (Sacred Rock)",
    artist: "Aster Aweke",
    album: "Kabu",
    genre: "Pop",
    artworkUrl: artwork.asterKabu
  },
  {
    title: "Minu Tenekana",
    artist: "Aster Aweke",
    album: "Ebo",
    genre: "Pop",
    artworkUrl: artwork.asterEbo
  },
  {
    title: "Ebo",
    artist: "Aster Aweke",
    album: "Ebo",
    genre: "Pop",
    artworkUrl: artwork.asterEbo
  },
  {
    title: "Yale Sime",
    artist: "Aster Aweke",
    album: "Ebo",
    genre: "Pop",
    artworkUrl: artwork.asterEbo
  },
  {
    title: "Abebayehosh",
    artist: "Gigi",
    album: "Gigi",
    genre: "Contemporary",
    artworkUrl: null
  },
  {
    title: "Ewedihalehu",
    artist: "Teddy Afro",
    album: "Yasteseryal",
    genre: "Pop",
    artworkUrl: null
  },
  {
    title: "Mela Mela",
    artist: "Mahmoud Ahmed",
    album: "Ere Mela Mela",
    genre: "Soul",
    artworkUrl: null
  },
  {
    title: "Almaz men eda new",
    artist: "Mahmoud Ahmed",
    album: "Ethiopiques 6: Almaz",
    genre: "Soul",
    artworkUrl: artwork.mahmoudAlmaz
  },
  {
    title: "Asha gedawo",
    artist: "Mahmoud Ahmed",
    album: "Ethiopiques 6: Almaz",
    genre: "Soul",
    artworkUrl: artwork.mahmoudAlmaz
  },
  {
    title: "Mela mela",
    artist: "Mahmoud Ahmed",
    album: "Ethiopiques 6: Almaz",
    genre: "Soul",
    artworkUrl: artwork.mahmoudAlmaz
  },
  {
    title: "Metche Dershe",
    artist: "Neway Debebe",
    album: "Ethiopian Grooves",
    genre: "Pop",
    artworkUrl: null
  },
  {
    title: "Anchi Bale Game",
    artist: "Asnaketch Worku",
    album: "Krar Songs",
    genre: "Traditional",
    artworkUrl: null
  }
];

const seedSongs: SongAttrs[] = seedSongMetadata.map((song, index) => ({
  ...song,
  duration: song.duration ?? seedDurations[index % seedDurations.length]
}));

const assertSafeSeedTarget = () => {
  if (config.nodeEnv === "production") {
    throw new Error("Refusing to seed while NODE_ENV=production.");
  }
};

const seed = async () => {
  assertSafeSeedTarget();

  await mongoose.connect(config.mongoUri);

  const result = await Song.bulkWrite(
    seedSongs.map((song) => ({
      updateOne: {
        filter: { title: song.title, artist: song.artist, album: song.album },
        update: { $set: song },
        upsert: true
      }
    })),
    { ordered: false }
  );

  console.log(
    `Seed complete: ${result.upsertedCount} inserted, ${result.matchedCount} already present.`
  );

  await mongoose.disconnect();
};

seed().catch(async (error: unknown) => {
  console.error(error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
