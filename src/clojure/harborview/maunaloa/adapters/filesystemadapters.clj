(ns harborview.maunaloa.adapters.filesystemadapters
  (:gen-class)
  (:import
   (java.io File)))

(defrecord FileSystemAdapter [ctx])
