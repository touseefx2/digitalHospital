
const useraReducer = (state=[],action)=>
{
    switch (action.type) {
        case "SET_AUSER":
            return (action.payload);
                default:
                     return (state);
    }
}

export default useraReducer;