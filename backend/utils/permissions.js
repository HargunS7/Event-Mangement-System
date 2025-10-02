const { supabase } = require('../supabaseClient');


//to check if someone is admin of the club
async function isAdminOfClub(supabase,userId,clubId){
    const {data,error} = await supabase
    .from('admins')
    .select('id')
    .eq('id',userId)
    .eq('club_id',clubId)
    .maybesingle();

    if(error) throw error;
    return !!data;
}

async function isPresidentOfClub(supabase,userId,clubId){
    const {data,error} = await supabase
        .from('club_presidents')
        .select('id')
        .eq('id',userId)
        .eq('club_id',clubId)
        .maybesingle();

        if(error) throw error;
        return !!data;
}

async function isHeadOfTeam(supabase, userId, teamId) {
  const { data, error } = await supabase
    .from('team_heads')
    .select('id, team_id')
    .eq('id', userId)
    .eq('team_id', teamId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

async function clubIdFromTeam(supabase, teamId) {
  const { data, error } = await supabase
    .from('teams')
    .select('club_id')
    .eq('id', teamId)
    .single();
  if (error) throw error;
  return data.club_id;
}

module.exports = {
  isAdminOfClub,
  isPresidentOfClub,
  isHeadOfTeam,
  clubIdFromTeam,
};



