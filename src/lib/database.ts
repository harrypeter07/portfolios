import { MongoClient, Db } from 'mongodb';

let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
  if (db) {
    return { client, db };
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(process.env.MONGODB_DATABASE || 'portfolios');
    
    console.log('✅ Connected to MongoDB');
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function getPortfolioFromDB(username: string) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('portfolios');
    
    const portfolio = await collection.findOne({ username });
    
    if (!portfolio) {
      console.log(`Portfolio not found for username: ${username}`);
      return null;
    }
    
    console.log(`✅ Portfolio found for username: ${username}`);
    return portfolio;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
}

export async function getAllPortfolios() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('portfolios');
    
    const portfolios = await collection.find({}).toArray();
    return portfolios;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
}

export async function createPortfolio(portfolioData: any) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('portfolios');
    
    const result = await collection.insertOne({
      ...portfolioData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log(`✅ Portfolio created with ID: ${result.insertedId}`);
    return result;
  } catch (error) {
    console.error('❌ Database insert error:', error);
    throw error;
  }
}

export async function getPreviewPortfolio(previewId: string) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('portfolios');
    
    const portfolio = await collection.findOne({ 
      username: `preview_${previewId}`,
      preview: true 
    });
    
    if (!portfolio) {
      console.log(`Preview portfolio not found for ID: ${previewId}`);
      return null;
    }
    
    // Check if preview has expired
    if (portfolio.expiresAt && new Date(portfolio.expiresAt) < new Date()) {
      console.log(`Preview portfolio expired for ID: ${previewId}`);
      return null;
    }
    
    console.log(`✅ Preview portfolio found for ID: ${previewId}`);
    return portfolio;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
}

export async function updatePortfolio(username: string, portfolioData: any) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('portfolios');
    
    const result = await collection.updateOne(
      { username },
      { 
        $set: {
          ...portfolioData,
          updatedAt: new Date().toISOString()
        }
      }
    );
    
    console.log(`✅ Portfolio updated for username: ${username}`);
    return result;
  } catch (error) {
    console.error('❌ Database update error:', error);
    throw error;
  }
}

export async function deletePortfolio(username: string) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('portfolios');
    
    const result = await collection.deleteOne({ username });
    
    console.log(`✅ Portfolio deleted for username: ${username}`);
    return result;
  } catch (error) {
    console.error('❌ Database delete error:', error);
    throw error;
  }
}
