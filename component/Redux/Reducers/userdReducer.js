
const userdReducer = (state=[],action)=>
{
    switch (action.type) {
        case "SET_DUSER":
            return (action.payload);
                default:
                     return (state);
    }
}

export default userdReducer;