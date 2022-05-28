import { useEffect, useLayoutEffect } from "react";

export const useClientsideEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;
