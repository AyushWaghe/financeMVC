import axios from "axios";

const fetchTransactions = async (userName,userId) => {
    try {
      // const response = await axios.get(`https://financemvc.onrender.com/fetchTransactions/fetchG?userName=${userName}`);
      const response = await axios.get(`http://localhost:8081/transaction/fetchforgraph?username=${userName}&userId=${userId}`);
      console.log(response.data);
      // console.log(response.data.transactions);
      return response.data;
    } catch (error) {
      console.error(error)
    }
  }

  export default fetchTransactions;
