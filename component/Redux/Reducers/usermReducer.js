
const usermReducer = (state=[],action)=>
{
    switch (action.type) {
        case "SET_MUSER":
            return (action.payload);
                default:
                     return (state);
    }
}

export default usermReducer;