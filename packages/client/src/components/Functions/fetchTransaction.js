import axios from "axios";

const fetchTransactions = async (userName) => {
    try {
      const response = await axios.get(`http://localhost:3001/fetchTransactions/fetchG?userName=${userName}`);
      console.log("erert");
      // console.log(response.data.transactions);
      return response.data.transactions;
    } catch (error) {
      console.log("erert", error.message);
    }
  }

  export default fetchTransactions;