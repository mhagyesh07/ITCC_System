const initialState = {
  tickets: [],
  loading: false,
  error: null,
};

export const ticketsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TICKETS_FETCH_REQUEST':
      return { ...state, loading: true, error: null };
    case 'TICKETS_FETCH_SUCCESS':
      return { ...state, loading: false, tickets: action.payload };
    case 'TICKETS_FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'TICKET_CREATE_REQUEST':
      return { ...state, loading: true, error: null };
    case 'TICKET_CREATE_SUCCESS':
      return { ...state, loading: false, tickets: [...state.tickets, action.payload] };
    case 'TICKET_CREATE_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};