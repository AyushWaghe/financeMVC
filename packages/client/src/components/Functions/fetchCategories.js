import axios from "axios";
import {api} from "../../api/AxiosConfig";

const fetchCategories = async (userId) => {
    try {
      const response = await api.get(`/transactions/categories?userId=${userId}`);
      console.log("User cats",response.data.data);
      // console.log(response.data.transactions);
      return response.data.data;
    } catch (error) {
      console.error(error)
    }
  }

export default fetchCategories;
