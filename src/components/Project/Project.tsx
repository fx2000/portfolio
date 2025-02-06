import React, { Fragment, useCallback } from "react";
import { Dialog, Box, DialogContent } from "@mui/material";
import Image from "next/image";
import { IProject } from "@/types/types";

export interface ProjectProps {
  maxWidth: "xs" | "sm" | "md" | "lg" | "xl" | false;
  open: boolean;
  onClose: () => void;
  project: IProject;
}

/**
 * ProjectSingle component displays a detailed view of a project in a modal dialog
 * @param maxWidth - Maximum width of the dialog
 * @param open - Controls if the dialog is open
 * @param onClose - Callback function when dialog is closed
 * @param project - Project data
 * @param project.title - Title of the project
 * @param project.description - Description of the project
 * @param project.company - Company name
 * @param project.client - Client name
 * @param project.contributions - Contributions to the project
 * @param project.technologies - Technologies used in the project
 * @param project.role - Role of the project
 * @param project.pImg - Main project image source
 * @param project.psub1img1 - First sub-image source
 * @param project.psub1img2 - Second sub-image source
 * @param project.pImgAlt - Alt text for main project image
 * @param project.psub1img1Alt - Alt text for first sub-image
 * @param project.psub1img2Alt - Alt text for second sub-image
 * @param project.url - URL of the project
 * @param project.type - Type of the project
 * @param project.media - Media of the project
 * @returns React component
 */
const Project = ({ maxWidth, open, onClose, project }: ProjectProps) => {
  const {
    title,
    description,
    company,
    client,
    role,
    contributions,
    technologies = [],
    about,
    pImg,
    psub1img1,
    psub1img2,
    pImgAlt = "",
    psub1img1Alt = "",
    psub1img2Alt = "",
    url = "#",
    type,
    media,
  } = project;

  /**
   * Handles closing the project modal
   * @returns {void}
   */
  const handleClose = useCallback((): void => {
    if (onClose) onClose();
  }, [onClose]);

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        className="modalWrapper quickview-dialog"
        maxWidth={maxWidth}
        aria-labelledby="project-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            zIndex: 1300, // Higher than navbar
          },
        }}
      >
        <Box className="modalBody modal-body project-modal">
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close project details"
          >
            <i className="fa fa-close" aria-hidden="true"></i>
          </button>
          <div className="tp-project-single-area">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-12 col-12">
                  <div className="tp-project-single-wrap">
                    <div className="tp-project-single-item">
                      <div className="row align-items-center mb-5">
                        <div className="col-lg-7">
                          <div className="tp-project-single-title">
                            <h3>{title}</h3>
                          </div>
                          <p>{description}</p>
                        </div>
                        <div className="col-lg-5">
                          <div className="tp-project-single-content-des-right">
                            <ul>
                              <li>
                                {type === "agency" ? "Agency:" : "Company:"}
                                <span>{company}</span>
                              </li>
                              <li>
                                Role:<span>{role}</span>
                              </li>
                              {type === "agency" && (
                                <li>
                                  Client:<span>{client}</span>
                                </li>
                              )}
                              <li>
                                Link:<span>{url}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="tp-project-single-main-img">
                        <Image
                          src={pImg}
                          alt={pImgAlt}
                          width={1000}
                          height={1000}
                        />
                      </div>
                    </div>
                    <div className="tp-project-single-item">
                      <div className="tp-project-single-title">
                        <h3>About This Project</h3>
                      </div>
                      <p>{about}</p>
                    </div>
                    {psub1img1 && psub1img2 && (
                      <div className="tp-project-single-gallery">
                        <div className="row mt-4">
                          <div className="col-md-6 col-sm-6 col-12">
                            <div className="tp-p-details-img">
                              <Image
                                src={psub1img1}
                                alt={psub1img1Alt}
                                width={1000}
                                height={1000}
                                style={{
                                  minHeight: "250px",
                                  maxHeight: "250px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-6 col-sm-6 col-12">
                            <div className="tp-p-details-img">
                              <Image
                                src={psub1img2}
                                alt={psub1img2Alt}
                                width={1000}
                                height={1000}
                                style={{
                                  minHeight: "250px",
                                  maxHeight: "250px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {media && (
                      <div className="tp-project-audio-wrapper">
                        <audio
                          controls
                          className="w-full mt-4"
                          style={{ width: "100%" }}
                        >
                          <source src={media.url} type={media.type} />
                          Your browser does not support the audio element.
                        </audio>
                        {media.title && (
                          <p className="audio-title mt-2">{media.title}</p>
                        )}
                      </div>
                    )}
                    <div className="tp-project-single-item">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="tp-project-single-title">
                            <h3>My Contributions</h3>
                          </div>
                          <p>{contributions}</p>
                        </div>
                      </div>
                    </div>
                    <div className="tp-project-single-item list-widget">
                      <div className="row">
                        <div className="col-lg-12 list-widget-s">
                          <div className="tp-project-single-title">
                            <h3>Technologies</h3>
                          </div>
                          <ul>
                            {technologies.map((technology) => (
                              <li key={technology}>{technology}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Dialog>
    </Fragment>
  );
};

export default Project;
