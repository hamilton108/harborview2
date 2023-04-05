(ns harborview.maunaloa.adapter.filesystemadapter
  (:gen-class)
  (:import
   (java.io File)))

(defrecord FileSystemAdapter [ctx])
