import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";



const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );

  
  if (err.name === "PrismaClientKnownRequestError") {
    switch (err.code) {
      case "P1000": 
        return res.status(401).json({
          error: "Unauthorized",
          message: "Database authentication failed",
        });
      case "P1001": 
        return res.status(503).json({
          error: "Service Unavailable",
          message: "Cannot connect to the database server",
        });
      case "P1002": 
        return res.status(504).json({
          error: "Gateway Timeout",
          message: "Database connection timed out",
        });
      case "P1003": 
        return res.status(404).json({
          error: "Not Found",
          message: "Database does not exist",
        });
      case "P1008": 
        return res.status(504).json({
          error: "Gateway Timeout",
          message: "Database operation timed out",
        });
      case "P1009": 
        return res.status(409).json({
          error: "Conflict",
          message: "Database already exists on the server",
        });
      case "P1010": 
        return res.status(403).json({
          error: "Forbidden",
          message: "Access denied for database user",
        });
      case "P1011": 
        return res.status(503).json({
          error: "Service Unavailable",
          message: "Error establishing a secure database connection",
        });
      case "P1012": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Schema validation error: ${err.message}`,
        });
      case "P1013": 
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid database connection string",
        });
      case "P1014": 
        return res.status(404).json({
          error: "Not Found",
          message: `Model ${err.meta?.modelName || "unknown"} does not exist`,
        });
      case "P1015": 
        return res.status(400).json({
          error: "Bad Request",
          message: "Prisma version not supported for the database",
        });
      case "P1016": 
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid raw query provided",
        });
      case "P1017": 
        return res.status(503).json({
          error: "Service Unavailable",
          message: "Database server closed the connection unexpectedly",
        });
      case "P2000": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Input value too long for column ${
            err.meta?.column || "unknown"
          }`,
        });
      case "P2001": 
        return res.status(404).json({
          error: "Not Found",
          message: "Record does not exist for the query",
        });
      case "P2002": 
        return res.status(400).json({
          error: "Bad Request",
          message: ` ${err.meta?.target || "field"} already taken `,
        });
      case "P2003": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Foreign key constraint failed on ${
            err.meta?.field_name || "field"
          }`,
        });
      case "P2004": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Constraint violation in the database`,
        });
      case "P2005": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Invalid value type for field ${
            err.meta?.field_name || "unknown"
          }`,
        });
      case "P2006": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Invalid value provided for field ${
            err.meta?.field_name || "unknown"
          }`,
        });
      case "P2007": 
        return res.status(400).json({
          error: "Bad Request",
          message: "Data validation error",
        });
      case "P2008": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Failed to parse the query: ${err.meta?.query || "unknown"}`,
        });
      case "P2009": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Query validation error: ${
            err.meta?.query_validation_error || "invalid query"
          }`,
        });
      case "P2010": 
        return res.status(500).json({
          error: "Internal Server Error",
          message: "Raw query execution failed",
        });
      case "P2011": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Null constraint violation on ${
            err.meta?.field_name || "field"
          }`,
        });
      case "P2012": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Missing required field ${
            err.meta?.field_name || "unknown"
          }`,
        });
      case "P2013": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Missing required argument ${
            err.meta?.argument_name || "unknown"
          }`,
        });
      case "P2014": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Relation violation: ${
            err.meta?.relation_name || "unknown"
          }`,
        });
      case "P2015": 
        return res.status(404).json({
          error: "Not Found",
          message: `Related record not found`,
        });
      case "P2016": 
        return res.status(400).json({
          error: "Bad Request",
          message: "Query interpretation error",
        });
      case "P2017": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Records in relation ${
            err.meta?.relation_name || "unknown"
          } are not connected`,
        });
      case "P2018": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Required connected records not found for ${
            err.meta?.relation_name || "unknown"
          }`,
        });
      case "P2019": 
        return res.status(400).json({
          error: "Bad Request",
          message: "Input error in query",
        });
      case "P2020": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Value out of range for ${err.meta?.field_name || "field"}`,
        });
      case "P2021": 
        return res.status(404).json({
          error: "Not Found",
          message: `Table ${err.meta?.table || "unknown"} does not exist`,
        });
      case "P2022": 
        return res.status(404).json({
          error: "Not Found",
          message: `Column ${err.meta?.column || "unknown"} does not exist`,
        });
      case "P2023": 
        return res.status(400).json({
          error: "Bad Request",
          message: "Inconsistent column data",
        });
      case "P2024": 
        return res.status(504).json({
          error: "Gateway Timeout",
          message: "Timed out acquiring a database connection",
        });
      case "P2025": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Operation failed: Required dependent record not found`,
        });
      case "P2026": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Unsupported database feature: ${
            err.meta?.feature || "unknown"
          }`,
        });
      case "P2027": 
        return res.status(500).json({
          error: "Internal Server Error",
          message: "Multiple errors occurred during query execution",
        });
      case "P2028": 
        return res.status(500).json({
          error: "Internal Server Error",
          message: "Transaction API error",
        });
      case "P2030": 
        return res.status(404).json({
          error: "Not Found",
          message: `Fulltext index not found for query`,
        });
      case "P2031": 
        return res.status(400).json({
          error: "Bad Request",
          message: "MongoDB replica set is required but not configured",
        });
      case "P2033": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Number exceeds 64-bit integer range for ${
            err.meta?.field_name || "field"
          }`,
        });
      case "P2034": 
        return res.status(409).json({
          error: "Conflict",
          message: "Transaction failed due to a write conflict or deadlock",
        });
      case "P2035": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Database assertion violation: ${err.message}`,
        });
      case "P2036": 
        return res.status(500).json({
          error: "Internal Server Error",
          message: "Error in external connector",
        });
      case "P2037": 
        return res.status(503).json({
          error: "Service Unavailable",
          message: "Too many database connections opened",
        });
      case "P5000": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Invalid datasource provider: ${
            err.meta?.provider || "unknown"
          }`,
        });
      case "P5001": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Preview feature not enabled: ${
            err.meta?.feature || "unknown"
          }`,
        });
      case "P5002": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Invalid datasource provider specified`,
        });
      case "P5003": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Operation not supported: ${
            err.meta?.operation || "unknown"
          }`,
        });
      case "P5004": 
        return res.status(400).json({
          error: "Bad Request",
          message: `Introspection operation not supported: ${
            err.meta?.operation || "unknown"
          }`,
        });
      case "P5005": 
        return res.status(500).json({
          error: "Internal Server Error",
          message: "Could not create database",
        });
      case "P5006": 
        return res.status(403).json({
          error: "Forbidden",
          message: "Dropping the database is not allowed",
        });
      case "P5007": 
        return res.status(403).json({
          error: "Forbidden",
          message: "Resetting the database is not allowed",
        });
      case "P5008": 
        return res.status(409).json({
          error: "Conflict",
          message: "Database already exists and is not empty",
        });
      default:
        return res.status(500).json({
          error: "Internal Server Error",
          message: `Unknown Prisma error: ${err.code}`,
        });
    }
  }

  if (err.status === 429) {
    return res.status(429).json({
      error: "Too Many Requests",
      message: err.message,
    });
  }

  if (err instanceof TypeError) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid input or type error",
    });
  }

  if (err instanceof SyntaxError) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid JSON syntax",
    });
  }

  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};

export default errorHandler;