import supabaseClient from "@/utils/supabase";

// Fetch Jobs

// Fetch Jobs with Pagination
export async function getJobs(
  token,
  {
    location,
    company_id,
    searchQuery,
    page = 1,
    pageSize = 6,
  } = {}
) {
  if (!token) {
    throw new Error("Supabase access token is missing");
  }

  const supabase = supabaseClient(token);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("jobs")
    .select(
      `
      *,
      company:companies(name, logo_url),
      saved:saved_jobs(id)
    `,
      { count: "exact" }
    )
    .range(from, to);

  if (location) query = query.eq("location", location);
  if (company_id) query = query.eq("company_id", company_id);
  if (searchQuery) query = query.ilike("title", `%${searchQuery}%`);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }

  return { data, count };
}


// Save / Unsave Job
export async function saveJob({
  token,
  user_id,
  job_id,
  alreadySaved = false,
}) {
  if (!token) {
    throw new Error("Supabase access token is missing");
  }

  if (!user_id || !job_id) {
    throw new Error("user_id or job_id missing");
  }

  const supabase = supabaseClient(token);

  if (alreadySaved) {
    // UNSAVE
    const { error } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", job_id)
      .eq("user_id", user_id);

    if (error) {
      console.error("Error deleting saved job:", error);
      throw error;
    }
  } else {
    // SAVE
    const { error } = await supabase
      .from("saved_jobs")
      .insert({ user_id, job_id });

    if (error) {
      console.error("Error saving job:", error);
      throw error;
    }
  }

  return true;
}

// Get single job
export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select(
      "*, company: companies(name,logo_url), applications: applications(*)"
    )
    .eq("id", job_id)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Job:", error);
    return null;
  }

  return data;
}

// Update hiring status
export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Updating Hiring Status:", error);
    return null;
  }

  return data;
}

export async function addNewjob(token,_,jobData) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error("Error Creating Job:", error);
    return null;
  }

  return data;
}

export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(name,logo_url))");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data;
}

export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

// Delete job
export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error: deleteError } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (deleteError) {
    console.error("Error deleting job:", deleteError);
    return data;
  }

  return data;
}