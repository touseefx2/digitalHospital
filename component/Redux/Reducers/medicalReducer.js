
const medicalReducer = (state=[],action)=>
{
    switch (action.type) {
        case "SET_MUSERS":
            return (action.payload);
                default:
                     return (state);
    }
}

export default medicalReducer;