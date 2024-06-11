import classes from "./loading.module.css";
export default function MealsLoadingPage() {
  return <p className={classes.loading}>Loading meals...</p>;
}
// Not ideal solution because loading is on all page
