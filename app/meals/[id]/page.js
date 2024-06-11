import Image from "next/image";
import classes from "./page.module.css";
import { getMealById } from "@/lib/meals";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const meal = await getMealById(params.id);

  if (!meal) {
    notFound();
  }

  return {
    title: meal.title,
    description: meal.summary,
  };
}

export default async function MealsItem({ params }) {
  const meal = await getMealById(params.id);

  if (!meal) {
    notFound();
  }

  meal.instructions = meal.instructions.replaceAll("\n", "<br />");

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image
            src={`https://adig-nextjs-demo-users-image.s3.eu-north-1.amazonaws.com/${meal.image}`}
            fill
            alt=""
          />
        </div>
        <div className={classes.headerText}>
          <h1>Title</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main className={classes.main}>
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{
            __html: meal.instructions,
          }}
        ></p>
      </main>
    </>
  );
}
