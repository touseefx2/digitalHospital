export const action_SetDUsers=(u)=>
{
return async (dispacth)=> 
    {
    dispacth({
        type:"SET_DUSERS",
        payload:u
    })
    }
}