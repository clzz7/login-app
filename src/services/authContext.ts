import { supabase } from "@/services/supabaseClient";

export const authContext = {

   async signInWithEmail(email: string, password: string){
      const result = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      return result;
  },

  async signUp(email: string, password: string, username: string) {
    const result = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                display_name: username,
                username: username
            }
        }
       
    }) 
    return result;
  },

  async resetPassword(email: string) {
    const result = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5173/changepass'
    })

    return result;
  },
  
  async updateUser(newPassword: string) {
    const result = await supabase.auth.updateUser({
        password: newPassword
    })

    return result;
 },

};

 