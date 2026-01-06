/* eslint-disable react/prop-types */
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { updateApplicationStatus } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

const ApplicationCard = ({ application, isCandidate = false }) => {
  // Resume download
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  /**
   * IMPORTANT:
   * Pass ONLY application.id (BIGINT)
   * NOT job_id, NOT an object
   */
  const {
    loading: loadingHiringStatus,
    fn: updateStatus,
  } = useFetch(updateApplicationStatus, application.id);

  // Status change handler
  const handleStatusChange = (status) => {
    updateStatus(status);
  };

  return (
    <Card className="relative">
      {loadingHiringStatus && (
        <BarLoader width="100%" color="#36d7b7" />
      )}

      <CardHeader>
        <CardTitle className="flex justify-between items-center font-bold">
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.name}

          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between gap-3">
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={15} />
            {application?.experience} years experience
          </div>

          <div className="flex gap-2 items-center">
            <School size={15} />
            {application?.education}
          </div>

          <div className="flex gap-2 items-center">
            <Boxes size={15} />
            Skills: {application?.skills}
          </div>
        </div>
        <hr />
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {new Date(application?.created_at).toLocaleString()}
        </span>

        {isCandidate ? (
          <span className="capitalize font-bold">
            Status: {application.status}
          </span>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
            disabled={loadingHiringStatus}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
