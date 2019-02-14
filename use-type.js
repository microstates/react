import { create, Store, Any } from 'microstates';
import { useEffect, useState, useRef } from 'react';

export default function useType(Type = Any, value) {
  let isMounted = useRef(true);

  let [state, setState] = useState(() => Store(create(Type, value), next => isMounted.current && setState(next)));

  useEffect(() => () => (isMounted.current = false), []);

  return state;
}
