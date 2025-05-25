import { createSlice } from "@reduxjs/toolkit";

const initialState  = {themeModalIsOpen : false, editProfileModalIsOpen : false,
    editPostModalIsOpen : false , editPostId : "", theme : JSON.parse(localStorage.getItem("theme"))
     ||  {primaryColor : "" , backgroundColor : ""}
}


const uiSlice = createSlice({
    name : "ui",
    initialState,
    reducers : {
        openThemeModal : (state=> state.themeModalIsOpen = true),
        closeThemeModal : (state=> state.themeModalIsOpen = false),
        changeTheme : ((state,action)=> {
            state.theme = action.payload;
        }), 
        openEditProfileModal : (state=> state.editProfileModalIsOpen = true),
        closeEditProfileModal : (state=> state.editProfileModalIsOpen = false),
        openEditPostModal :(state,action)=> {
            state.editPostModalIsOpen = true,
            state.editPostId = action.payload
        },
        closeEditPostModal : (state,action)=> {
            state.editPostModalIsOpen  = false,
            state.editPostId = action.payload
        }



    }
})

export const uiActions = uiSlice.actions;
export default uiSlice;