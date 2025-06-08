"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import { writeClient } from "@/sanity/lib/write-client";
import { parse } from "path";
import slugify from "slugify";

export const createPitch = async (state: any, form: FormData, pitch: any) => {
    const session = await auth();

    if(!session) return parseServerActionResponse({
        error: "Not signed in", status: "Error"
    });

    const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch"),
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const startup = {
        title,
        description,
        category,
        link,
        slug: {
            _type: slug,
            current: slug,
        },
        author: {
            _type: "reference",
            _ref: session?.id,
        },
        pitch,
    };

    const result = await writeClient.create({ _type: 'startup', ...startup});

    return parseServerActionResponse({
        ...result,
        error: "",
        status: "SUCCESS",
    })
  } catch (error) {
    console.log(error);
  }

};