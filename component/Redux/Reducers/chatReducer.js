
const is = {
    messages:[]
}

const chatReducer = (state=is,action)=>
{
    switch (action.type) {
        case "CHAT_UPDATE_MESSAGES":
            return {...state,messages:action.payload}
            case  "SET_CHAT_MESSAGES":
            return {...state,messages:action.payload}
                default:
                     return (state);
    }
}

export default chatReducer;