export type LikeCardData = {
  id: number;
  title: string;
  description: string;
  image: string;
};

export const cards: LikeCardData[] = [
  {
    id: 1,
    title: "Games",
    description:
      "Games that make me forget what time it is. Basically anything that deletes my sense of time.",
    image: "/images/minecraft.jpg",
  },
  {
    id: 2,
    title: "Stories",
    description:
      "Movies, series, anime and Kdramas. I like stories that leave me staring at the ceiling after they're over.",
    image: "/images/onePiece.jfif",
  },
  {
    id: 3,
    title: "People",
    description:
      "People who can admit they're wrong after seeing better evidence.",
    image: "/images/people.jpg",
  },
  {
    id: 4,
    title: "Sleep",
    description: "The greatest invention ever. Waking up is a design flaw humanity still hasn't patched.",
    image: "/images/sleep.jpg",
  },
];