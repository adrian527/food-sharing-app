"use client";
export default function MongoMissingCredentialsError({ error }) {
  return (
    <main className="error">
      <h1>Error occurred!</h1>
      <p>Failed to fetch meal data. Please try again later.</p>
    </main>
  );
}
