import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";

import JobCard from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";

const PAGE_SIZE = 6;

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [page, setPage] = useState(1);

  const { isLoaded } = useUser();

  const { data: companies, fn: fnCompanies } = useFetch(getCompanies);

  const {
    loading: loadingJobs,
    data,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
    page,
    pageSize: PAGE_SIZE,
  });
  
  const jobs = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search-query");
    if (query !== null) setSearchQuery(query);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
    setPage(1);
  };

  if (!isLoaded) {
    return <BarLoader width="100%" color="#36d7b7" />;
  }
    console.log(page,totalPages);


  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/* 🔹 ROW 1 — SEARCH (UNCHANGED) */}
      <form
        onSubmit={handleSearch}
        className="h-14 flex w-full gap-2 items-center mb-3"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title.."
          name="search-query"
          className="h-full flex-1 px-4 text-md"
        />
        <Button type="submit" className="h-full w-28" variant="blue">
          Search
        </Button>
      </form>

      {/* 🔹 ROW 2 — FILTERS (UNCHANGED) */}
      <div className="grid grid-cols-2 gap-2 w-full mb-4">
        <div className="grid grid-cols-2 gap-2">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {State.getStatesOfCountry("IN").map(({ name }) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={company_id} onValueChange={setCompany_id}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {companies?.map(({ id, name }) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="destructive"
          className="w-full h-full text-lg"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

      {/* JOBS */}
      {loadingJobs && (
        <BarLoader className="mt-4" width="100%" color="#36d7b7" />
      )}

      {!loadingJobs && (
        <>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs?.length ? (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              ))
            ) : (
              <div>No Jobs Found 😢</div>
            )}
          </div>

          {/* 🔹 PAGINATION (UI UNCHANGED) */}
          {totalPages > 1 && (
            <>
              <Pagination className="mt-10">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => page > 1 && setPage(page - 1)}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={page === i + 1}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        page < totalPages && setPage(page + 1)
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              {/* ✅ ONLY ADDITION */}
              <div className="text-center mt-2 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default JobListing;
