(ns harborview.commonutils
  (:require
   [clojure.core.match :refer [match]])
  (:import
   (org.apache.ibatis.session SqlSession)
   (critter.util MyBatisUtil)))

(comment str->oid
         {"YAR" 3})

(def not-nil? (comp not nil?))

(defn check-arg [a b]
  ;(match [(mod a 3) (mod a 5)]
  (match b
    :int
    `(if-not (int? ~a)
       (throw (RuntimeException. (str "Not an int: " (class ~a) " (" ~a ")"))))
    :string
    `(if-not (string? ~a)
       (throw (RuntimeException. (str "Not a string: " (class ~a) " (" ~a ")"))))
    :number
    `(if-not (number? ~a)
       (throw (RuntimeException. (str "Not a number: " (class ~a) " (" ~a ")"))))
    :double
    `(if-not (double? ~a)
       (throw (RuntimeException. (str "Not a double: " (class ~a) " (" ~a ")"))))
    :bool
    `(if-not (boolean? ~a)
       (throw (RuntimeException. (str "Not a boolean: " (class ~a) " (" ~a ")"))))
    :any
    nil
    :else
    `(if-not (instance? ~b ~a)
       (throw (RuntimeException. (str "Not a " '~b " but " (class ~a) ", value: " ~a))))))

(defmacro defn-type [fn-name args & body]
  (prn fn-name ", " (class args) ", " args  ", " (class body) ", " body)
  (let [n (count args)]
    (cond
      (= n 2)
      (let [a0# (get args 0)
            a1# (get args 1)
            check-clause (check-arg a0# a1#)]
        `(def ~fn-name
           (fn [~a0#]
             ~check-clause
             ~@body)))
      (= n 4)
      (let [a0# (get args 0)
            a1# (get args 1)
            b0# (get args 2)
            b1# (get args 3)
            c1 (check-arg a0# a1#)
            c2  (check-arg b0# b1#)
            chex (filter not-nil? [c1 c2])]
        `(def ~fn-name
           (fn [~a0# ~b0#]
             ~@chex
             ~@body)))
      (= n 6)
      (let [a0# (get args 0)
            a1# (get args 1)
            b0# (get args 2)
            b1# (get args 3)
            c0# (get args 4)
            c1# (get args 5)
            c1 (check-arg a0# a1#)
            c2  (check-arg b0# b1#)
            c3  (check-arg c0# c1#)
            chex (filter not-nil? [c1 c2 c3])]
        `(def ~fn-name
           (fn [~a0# ~b0# ~c0#]
             ~@chex
             ~@body)))
      (= n 8)
      (let [a0# (get args 0)
            a1# (get args 1)
            b0# (get args 2)
            b1# (get args 3)
            c0# (get args 4)
            c1# (get args 5)
            d0# (get args 6)
            d1# (get args 7)
            c1 (check-arg a0# a1#)
            c2  (check-arg b0# b1#)
            c3  (check-arg c0# c1#)
            c4  (check-arg d0# d1#)
            chex (filter not-nil? [c1 c2 c3 c4])]
        `(def ~fn-name
           (fn [~a0# ~b0# ~c0# ~d0#]
             ~@chex
             ~@body)))
      :else
      (prn "Argument vector must be 2, 4, 6, or 8"))))

(comment demo
         [i :int
          k :any
          j :double]
         (prn i)
         (prn k))

(defn close-to
  [x y epsilon]
  (<= (Math/abs (- x y)) epsilon))

(defmacro map-1 [method items]
  `(map #(~method %) ~items))

(defmacro with-session [mapper & body]
  `(let [factory# (MyBatisUtil/getFactory)
         session# ^SqlSession (.openSession factory#)
         ~'it (.getMapper session# ~mapper)]
     (try
       (let [result# ~@body]
         result#)
       (finally
         (if (not-nil? session#)
           (do
             (prn "Closing session")
             (doto session# .commit .close)))))))

(defmacro with-session-2 [mapper mapper2 & body]
  `(let [factory# (MyBatisUtil/getFactory)
         session# ^SqlSession (.openSession factory#)
         ~'it (.getMapper session# ~mapper)
         ~'it2 (.getMapper session# ~mapper2)]
     (try
       (let [result# ~@body]
         result#)
       (finally
         (if (not-nil? session#)
           (do
             (prn "Closing session")
             (doto session# .commit .close)))))))

(def ^:dynamic *reset-cache* false)

(defn rs [v]
  (if (string? v)
    (let [vs (if-let [v (re-seq #"(\d+),(\d+)" v)]
               (let [[a b c] (first v)] (str b "." c))
               v)]
      (read-string vs))
    v))

(comment mem-binding [f]
         (let [mem (atom {})]
           (fn [& args]
             (if (= *reset-cache* true)
               (reset! mem {}))
             (let [arg0 (first args)]
               (if-let [e (find @mem arg0)]
                 (val e)
                 (let [ret (apply f args)]
                   (swap! mem assoc arg0 ret)
                   ret))))))

(comment defn-memb [name & body]
         `(def ~name (mem-binding (fn ~body))))

(defn double->decimal
  ([v]
   (/ (Math/round (* v 10.0)) 10.0))
  ([v round-factor]
   (/ (Math/round (* v round-factor)) round-factor)))

(defn find-first [f coll]
  (first (drop-while (complement f) coll)))

(comment if-let*
         ([bindings-vec then] `(if-let* ~bindings-vec ~then nil))
         ([bindings-vec then else]
          (if (seq bindings-vec)
            `(let ~bindings-vec
               (if (and ~@(take-nth 2 bindings-vec))
                 ~then
                 ~else)))))

(defmacro defn-defaults [name args & body]
  "Create a function that can provide default values for arguments.
  Arguments that are optional should be placed in a hash as the
  last argument with their names mapped to their default values.
  When invoking the function, :<optional-argument-name> <value>
  specifies the value the argument should take on."

  (if (map? (last args))
    `(defn
       ~name
       ~(let [mandatory-args (drop-last args)
              options (last args)
              option-names (vec (keys options))]
          (vec (concat mandatory-args
                       [(symbol "&") {:keys option-names
                                      :or options}])))
       ~@body)
    `(defn ~name ~args ~@body)))

(comment
  ; EXAMPLE
  (defn-defaults foo [a b {c 5 d 10}]
    (+ a b c d))

  (foo 5 10) ;=> 30
  (foo 5 10 :c 10 :d 20) ;=> 45
  (foo 5 10 :c 0)) ;=> 25
