import { Response } from "express";
import ServerResponse from "./serverResponse";

class PaginationResponse {
    total: number
    page: number
  limit: number
  res:Response
  constructor(
    res: Response,
        total: number,
        page: number,
      limit: number,
  ) { 
    this.total = total,
      this.res = res,
      this.page = page,
      this.limit=limit
    
  }
  static success(res:Response,message:string,data:any,total:number,page:number,limit:number){
    return ServerResponse.successWithPagination(res, message, data, total, page, limit)
  }
    
}

export default PaginationResponse