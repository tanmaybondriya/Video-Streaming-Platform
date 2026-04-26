import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const movies = [
    {
      title: "The Shawshank Redemption",
      description:
        "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      genre: "Drama",
      duration: "142 min",
      thumbnailUrl:
        "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // placeholder video
    },
    {
      title: "The Godfather",
      description:
        "The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant youngest son.",
      genre: "Crime, Drama",
      duration: "175 min",
      thumbnailUrl:
        "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      title: "The Dark Knight",
      description:
        "When the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      genre: "Action, Crime, Drama",
      duration: "152 min",
      thumbnailUrl:
        "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      title: "Pulp Fiction",
      description:
        "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      genre: "Crime, Drama",
      duration: "154 min",
      thumbnailUrl:
        "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      title: "Forrest Gump",
      description:
        "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
      genre: "Drama, Romance",
      duration: "142 min",
      thumbnailUrl:
        "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      title: "Fight Club",
      description:
        "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something much more.",
      genre: "Drama",
      duration: "139 min",
      thumbnailUrl:
        "https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  ];

  for (const movie of movies) {
    await prisma.movie.create({ data: movie });
  }

  console.log("✅ Seeded movies successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
