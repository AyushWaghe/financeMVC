import axios from "axios";

const fetchTransactions = async (userName) => {
    try {
      // const response = await axios.get(`https://financemvc.onrender.com/fetchTransactions/fetchG?userName=${userName}`);
      const response = await axios.get(`https://financemvc.onrender.com/transactionOperation/fetchG?userName=${userName}`);
      console.log("erert");
      // console.log(response.data.transactions);
      return response.data.transactions;
    } catch (error) {
      console.log("erert", error.message);
    }
  }

  export default fetchTransactions;
