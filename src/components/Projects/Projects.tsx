import Image from "next/image";
import React, { useMemo, useState } from "react";
import { Project } from "@/components/Project";
import { IProject } from "@/types/types";
import { useGetProjects } from "@/hooks";

const PROJECTS_PER_PAGE = 6;

/**
 * ProjectSection Component
 * @component
 * @returns {JSX.Element} The rendered ProjectSection component
 */
const ProjectSection = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [activeProject, setActiveProject] = useState<IProject>();
  const [displayCount, setDisplayCount] = useState<number>(PROJECTS_PER_PAGE);

  // Get projects from the API
  const { data: projects = [] } = useGetProjects();

  // Determine if the Show More button should be shown
  const moreActive = useMemo(
    () => displayCount < projects.length,
    [displayCount, projects]
  );

  /**
   * Handles closing the project modal
   * @returns {void}
   */
  const handleClose = (): void => {
    setOpen(false);
  };

  /**
   * Handles opening the project modal and setting the selected project state
   * @param item - The project item to display in the modal
   * @returns {void}
   */
  const handleClickOpen = (item: IProject): void => {
    setOpen(true);
    setActiveProject(item);
  };

  /**
   * Handles setting the button state to show more projects
   * @returns {void}
   */
  const handleToggleShowMore = (): void => {
    setDisplayCount(moreActive ? projects.length : PROJECTS_PER_PAGE);
  };
  console.log({ displayCount, moreActive });
  return (
    <section className="tp-project-section section-padding">
      <div className="container">
        <div className="tp-section-title">
          <span>Portfolio</span>
          <h2>What I&apos;ve been working on</h2>
        </div>
        <div className="tp-project-wrap">
          <div className="row">
            {projects.slice(0, displayCount).map((project: IProject) => (
              <div
                className="col col-xl-4 col-lg-6 col-sm-12 col-12"
                key={project.id}
              >
                <div
                  className="tp-project-item"
                  role="button"
                  onClick={() => handleClickOpen(project)}
                >
                  <div className="tp-project-img">
                    <Image
                      src={project.pImg}
                      alt={project.pImgAlt || ""}
                      width={1000}
                      height={300}
                      style={{
                        minHeight: "260px",
                        maxHeight: "260px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="tp-project-content">
                    <h2>{project.title}</h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={`project-btn`}>
            <button className="theme-btn" onClick={handleToggleShowMore}>
              View {moreActive ? "more" : "less"}...
            </button>
          </div>
        </div>
      </div>
      {activeProject && (
        <Project
          open={open}
          onClose={handleClose}
          project={activeProject}
          maxWidth="lg"
        />
      )}
    </section>
  );
};

export default ProjectSection;
