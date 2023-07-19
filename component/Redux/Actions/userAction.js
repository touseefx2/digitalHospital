
export const action_SetUser=(u)=>
{
return async (dispacth)=> 
    {
    dispacth({
        type:"SET_USER",
        payload:u
    })
    }
}

export const action_SetdUser=(u)=>
{
return async (dispacth)=> 
    {
    dispacth({
        type:"SET_DUSER",
        payload:u
    })
    }
}

export const action_SetaUser=(u)=>
{
return async (dispacth)=> 
    {
    dispacth({
        type:"SET_AUSER",
        payload:u
    })
    }
}

export const action_SetmUser=(u)=>
{
return async (dispacth)=> 
    {
    dispacth({
        type:"SET_MUSER",
        payload:u
    })
    }
}

