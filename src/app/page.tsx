"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isAdult, setIsAdult] = useState(false); // TODO: change to false and figure out a way to not show dialog everytime
  const [isExplainRules, setExplainRules] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      setIsAdult(false);
    }
    if (isSignedIn) {
      setIsAdult(true);
    }
  }, [isSignedIn]);

  return (
    <div className="h-screen container mx-auto">
      <div className="flex justify-end items-end p-4 m-4 border w-fit"></div>
      <div>
        <AlertDialog open={!isAdult}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are 18+?</AlertDialogTitle>
              <AlertDialogDescription>
                The content on this page is for adults only.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Link href="https://google.com/">Leave</Link>
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setIsAdult(true);
                }}
              >
                I am 18+
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div
        className={
          isAdult
            ? "h-screen flex flex-col justify-center items-center gap-8"
            : "blur h-screen flex flex-col justify-center items-center gap-8"
        }
      >
        <div className="flex flex-col gap-8 justify-center items-center text-center">
          <h1 className="text-5xl">DP RPG GAME</h1>
          <h2 className="text-2xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias rerum
            sequi suscipit quia soluta facilis fuga laboriosam voluptates in
            maiores facere vel omnis laborum ad vero, impedit dicta rem dolorum,
            hic numquam voluptatem ullam perferendis! Laudantium facilis ratione
            illo culpa!
          </h2>
        </div>
        <Button size={"lg"} onClick={() => setExplainRules(true)}>
          Start game
        </Button>
      </div>
      <div>
        <AlertDialog open={isExplainRules}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>The rules of the game</AlertDialogTitle>
              <AlertDialogDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam,
                quo tempore doloremque eos necessitatibus, numquam culpa
                voluptates voluptate ab odio natus, sit accusamus consequuntur
                illo ipsa velit veniam nihil! Nulla sit distinctio maiores eum
                dolorum fugiat architecto? Error nemo cupiditate ullam aut
                cumque sapiente voluptas similique eligendi laborum? Nobis,
                assumenda?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setExplainRules(false)}>
                Go back
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setExplainRules(false);
                  router.push("/main");
                }}
              >
                Got it, let's go.
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
