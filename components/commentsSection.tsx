import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import avatar01 from "@/public/01.png";
import avatar02 from "@/public/02.png";
import avatar03 from "@/public/03.png";
import avatar04 from "@/public/04.png";
import avatar05 from "@/public/05.png";
import { PaperPlaneIcon, ArrowUpIcon } from "@radix-ui/react-icons";

const avatars = [avatar01, avatar02, avatar03, avatar04, avatar05];

const sampleComments = [
  {
    username: "Sarah Miller",
    comment: "I'll get the guac and chips!",
    likes: 0,
    commentID: uuidv4(),
  },
  {
    username: "Chris Anderson",
    comment: "I'm bringing popcorn! Who else is in for snacks?",
    likes: 0,
    commentID: uuidv4(),
  },
  {
    username: "John Doe",
    comment:
      "I'm so excited for this one guys! Can't wait to see you all there!",
    likes: 0,
    commentID: uuidv4(),
  },
  {
    username: "Jane Smith",
    comment: "Yes! This looks like such a great movie choice. Count me in!",
    likes: 0,
    commentID: uuidv4(),
  },
  {
    username: "Mike Johnson",
    comment: "Sounds awesome! Looking forward to it.",
    likes: 0,
    commentID: uuidv4(),
  },
  {
    username: "Emily Wong",
    comment:
      "I've heard great things about this movie. Can't wait for movie night!",
    likes: 0,
    commentID: uuidv4(),
  },
];

export default function CommentsSection({ eventID }: { eventID: string }) {
  const router = useRouter();
  const [commentsList, setCommentsList] = useState<any>([]);

  useEffect(() => {
    const loadDocuments = async () => {
      const docRef = doc(db, "comments", eventID);
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());
      if (docSnap.exists()) {
        let commentsList = docSnap.data().comments;
        for (let i = 0; i < commentsList.length; i++) {
          commentsList[i].avatar = avatars[i % avatars.length];
        }
        setCommentsList(docSnap.data().comments);
      }
    };
    loadDocuments();
  }, []);

  return (
    <Card
      style={{
        maxHeight: "75vh",
        backgroundColor: "#16181D",
        color: "white",
        border: "none",
        overflow: "scroll",
        marginTop: "1rem",
      }}
    >
      <form
        style={{ display: "flex", alignItems: "center" }}
        onSubmit={(e) => {
          e.preventDefault();
          const comment = e.target.comment.value;
          console.log(comment);
          const newComment = {
            username: "Jane Doe",
            comment: comment,
            likes: 0,
            commentID: uuidv4(),
            avatar: avatars[Math.floor(Math.random() * avatars.length)],
          };
          setCommentsList((prevCommentsList: any) => {
            return [newComment, ...prevCommentsList];
          });
          e.target.comment.value = "";
        }}
      >
        <Textarea
          id="comment"
          name="comment"
          placeholder="Leave a message.."
          style={{
            width: "1000px",
            color: "black",
            marginBottom: "1rem",
            marginTop: "1rem",
          }}
        />
        <Button type="submit">
          {" "}
          <PaperPlaneIcon className="mr-2 h-4 w-5" />{" "}
        </Button>
      </form>
      <CardContent>
        <Table style={{ width: "100%" }}>
          <TableBody>
            {commentsList.map((comment: any) => (
              <TableRow key={comment.commentID}>
                <TableCell className="hidden sm:table-cell">
                  <Avatar>
                    <AvatarImage src={comment.avatar} alt="Avatar" />
                    <AvatarFallback style={{ color: "black" }}>
                      {comment.username[0]}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                  <div>{comment.username}</div>
                  <div>{comment.comment}</div>
                </TableCell>
                <TableCell className="font-medium" style={{ width: "15%" }}>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setCommentsList((prevCommentsList: any) => {
                        return prevCommentsList.map((prevComment: any) => {
                          if (prevComment.commentID === comment.commentID) {
                            return {
                              ...prevComment,
                              likes: prevComment.likes + 1,
                            };
                          }
                          return prevComment;
                        });
                      });
                    }}
                  >
                    <ArrowUpIcon className="mr-2 h-4 w-4" /> {comment.likes}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
