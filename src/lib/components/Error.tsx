import { Component } from "solid-js";

interface ErrorPageProps {
  code: number;
  message: string;
}

const ErrorPage: Component<ErrorPageProps> = (props) => {
  return (
    <div class="flex flex-col items-center justify-center">
      <p>Code: {props.code}</p>
      <p>Message: {props.message}</p>
    </div>
  );
};

export default ErrorPage;
