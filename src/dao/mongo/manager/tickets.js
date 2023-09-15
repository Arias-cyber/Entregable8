import ticketModel from "../models/ticket.js";

export default class TicketsManager {
    constructor() {
      this.ticketModel = ticketModel;
    }
  
    createTicket = (ticketData) => {
      return this.ticketModel.create(ticketData);
    }
  
  }