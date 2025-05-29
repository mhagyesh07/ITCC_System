import axios from 'axios';

export const fetchTickets = () => async (dispatch) => {
  try {
    dispatch({ type: 'TICKETS_FETCH_REQUEST' });

    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/tickets`);

    dispatch({
      type: 'TICKETS_FETCH_SUCCESS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'TICKETS_FETCH_FAIL',
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const createTicket = (ticketData) => async (dispatch) => {
  try {
    dispatch({ type: 'TICKET_CREATE_REQUEST' });

    const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/tickets`, ticketData);

    dispatch({
      type: 'TICKET_CREATE_SUCCESS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'TICKET_CREATE_FAIL',
      payload: error.response?.data?.message || error.message,
    });
  }
};