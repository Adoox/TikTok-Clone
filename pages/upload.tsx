import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import axios from "axios";
import { SanityAssetDocument } from "@sanity/client";
import useAuthStore from "../store/authStore";
import { client } from "../utils/client";

import { topics } from "../utils/constants";

const Upload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoAsset, setvideoAsset] = useState<
    SanityAssetDocument | undefined
  >();
  const [wrongVideoType, setWrongVideoType] = useState(false);

  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(topics[0].name);
  const [savingPost, setSavingPost] = useState(false);

  const { userProfile }: { userProfile: any } = useAuthStore();

  const router = useRouter();

  const uploadVideo = async (e: any) => {
    const selectedFile = e.target.files[0];
    const fileTypes = ["video/mp4", "video/webm", "video/ogg"];

    if (fileTypes.includes(selectedFile.type)) {
      client.assets
        .upload("file", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((data) => {
          setvideoAsset(data), setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setWrongVideoType(true);
    }
  };

  const handlePost = async () => {
    if (caption && videoAsset?._id && category) {
      setSavingPost(true);

      const document = {
        _type: "post",
        caption: caption,
        video: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: videoAsset?._id,
          },
        },
        userId: userProfile?._id,
        postedBy: {
          _type: "postedBy",
          _ref: userProfile?._id,
        },
        topic: category,
      };

      await axios.post("http://localhost:3000/api/post", document);

      router.push("/");
    }
  };
  return (
    <div className="flex w-full h-full absolute left-0 top-[60px] mb-10 pt-10 lg:pt-20 bg-[white] justify-center">
      <div className="bg-white rounded-lg xl:h-[80vh] w-[80%] flex gap-6 flex-wrap justify-center items-center p-14 pt-6">
        <div>
          <div>
            <p className="text-2xl font-bold">Upload Video</p>
            <p className="text-md text-gray-400 mt-1">
              Post Video to your account
            </p>
          </div>
          <div className="border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 w-[260px] h-[460px] p-10 cursor-pointer hover:border-red-300 hover:bg-gray-100">
            {isLoading ? (
              <p>Uploading...</p>
            ) : (
              <div>
                {videoAsset ? (
                  <div>
                    <video
                      src={videoAsset?.url}
                      loop
                      controls
                      className="rounded-xl h-[450px] mt-16"
                    ></video>
                  </div>
                ) : (
                  <div>
                    <label>
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="flex flex-col items-center justify-center">
                          <p>
                            <FaCloudUploadAlt className="text-gray-300 text-6xl" />
                          </p>
                          <p className="text-md font-semibold">
                            Select video to upload
                          </p>

                          <p className="bg-[red] text-center mt-10 rounded text-white text-md font-medium p-2 w-52 outline-none">
                            {" "}
                            Select File
                          </p>
                        </div>
                        <input
                          type="file"
                          name="upload-video"
                          onChange={(e) => uploadVideo(e)}
                          className="w-0 h-0"
                        />
                      </div>
                    </label>
                  </div>
                )}
              </div>
            )}

            {wrongVideoType && (
              <p className="text-center text-xč text-red-500 font-semibold">
                Please select a video file
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 pb-10">
          <label className="text-md font-semibold">Caption</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="rounded outline-none text-md border-2 border-gray-200 p-2"
          ></input>
          <label className="text-md font-semibold">Category</label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="outline-none border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer"
          >
            {topics.map((topic) => (
              <option
                value={topic.name}
                key={topic.name}
                className="outline-none capitalize text-gray-600 bg-white p-2 hover:bg-slate-300"
              >
                {topic.name}
              </option>
            ))}
          </select>

          <div className="flex gap-6 mt-10">
            <button
              onClick={() => {}}
              type="button"
              className="border-gray-300 border-2 text-md font-medium rounded w-28 lg:w-44 outline-none p-2"
            >
              Discard
            </button>
            <button
              onClick={handlePost}
              type="button"
              className="bg-[red] text-white border-2 text-md font-medium rounded w-28 lg:w-44 outline-none p-2"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
