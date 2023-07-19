export const action_SetMUsers=(u)=>
{
return async (dispacth)=> 
    {
    dispacth({
        type:"SET_MUSERS",
        payload:u
    })
    }
}