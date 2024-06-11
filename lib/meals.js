import fs from "node:fs";
import { MongoClient, ObjectId } from "mongodb";
import xss from "xss";
import slugify from "slugify";
import { S3 } from "@aws-sdk/client-s3";

export async function getMeals() {
  // Connection URL
  const url = "mongodb://127.0.0.1:27017";
  // Database name
  const dbName = "test";
  // Collection name
  const collectionName = "meals";

  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected successfully to server");

    // Get the database
    const db = client.db(dbName);

    // Get the meals collection
    const collection = db.collection(collectionName);

    // Find all documents in the collection
    const meals = await collection.find({}).toArray();

    console.log("Meals collection:", meals);
    return meals;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  } finally {
    // Close the connection
    await client.close();
  }
}

export async function getMealById(mealId) {
  // Connection URL
  const url = "mongodb://127.0.0.1:27017";
  // Database name
  const dbName = "test";
  // Collection name
  const collectionName = "meals";

  // Create a new MongoClient
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected successfully to server");

    // Get the database
    const db = client.db(dbName);

    // Get the meals collection
    const collection = db.collection(collectionName);

    // Convert the string ID to an ObjectId
    const objectId = new ObjectId(mealId);

    // Find the document with the specified ID
    const meal = await collection.findOne({ _id: objectId });

    console.log("Meal:", meal);
    return meal;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  } finally {
    // Close the connection
    await client.close();
  }
}

export async function saveMeal(newMeal) {
  newMeal.instructions = xss(newMeal.instructions);
  const slug = slugify(newMeal.title, { lower: true });
  const extension = newMeal.image.name.split(".").pop();
  const fileName = `${slug}.${extension}`;
  // const stream = fs.createWriteStream(`public/images/${fileName}`);

  const s3 = new S3({
    region: "eu-north-1",
  });

  const bufferedImage = await newMeal.image.arrayBuffer();

  // save in public folder
  // stream.write(Buffer.from(bufferedImage), (error) => {
  //   if (error) {
  //     throw new Error("Saving image failed!");
  //   }
  // });

  newMeal.image = `${fileName}`;

  s3.putObject({
    Bucket: "adig-nextjs-demo-users-image",
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: newMeal.image.type,
  });

  // Connection URL
  const url = "mongodb://127.0.0.1:27017";
  // Database name
  const dbName = "test";
  // Collection name
  const collectionName = "meals";

  // Create a new MongoClient
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected successfully to server");

    // Get the database
    const db = client.db(dbName);

    // Get the meals collection
    const collection = db.collection(collectionName);

    const result = await collection.insertOne(newMeal);

    return result.insertedId;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  } finally {
    // Close the connection
    await client.close();
  }
}
