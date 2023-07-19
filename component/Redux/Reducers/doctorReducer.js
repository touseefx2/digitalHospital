
const doctorReducer = (state=[],action)=>
{
    switch (action.type) {
        case "SET_DUSERS":
            return (action.payload);
                default:
                     return (state);
    }
}

export default doctorReducer;