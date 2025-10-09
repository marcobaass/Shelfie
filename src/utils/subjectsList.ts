export const allowedSubjects = [
  "Architecture",
  "Art",
  "Art History",
    "Biology",
    "Biographies",
    "Children",
    "Chemistry",
    "Cooking",
    "Design",
    "Fiction",
    "Finance",
    "Film",
    "Fantasy",
    "Historical Fiction",
    "History",
    "Horror",
    "Humor",
    "Management",
    "Mental Health",
    "Medicine",
    "Mystery and Detective Stories",
    "Music",
    "Philosophy",
    "Political Science",
    "Poetry",
    "Programming",
    "Psychology",
    "Recipes",
    "Religion",
    "Romance",
    "Science",
    "Science Fiction",
    "Self-Help",
    "Short Stories",
    "Textbooks",
    "Thriller",
    "Plays",
    "Sociology",
    "Young Adult"
  ];

export function splitSubjects(detailedBookSubjects: string[] = [], maxSubjects: number) {

  const filteredSubjects = detailedBookSubjects.filter(subject => allowedSubjects.includes(subject));

  return {
    displayedSubjects: filteredSubjects.slice(0, maxSubjects),
    remainingSubjects: filteredSubjects.slice(maxSubjects)
  }
}
