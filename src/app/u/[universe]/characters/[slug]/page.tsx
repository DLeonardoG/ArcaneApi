import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FavoriteTarget } from "@prisma/client";
import { auth } from "@/auth";
import { FavoriteButton } from "@/components/favorite-button";
import { getCharacter } from "@/lib/queries";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ universe: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { universe, slug } = await params;
  const character = await getCharacter(universe, slug);
  if (!character) return { title: "Character" };
  return {
    title: `${character.name} · ${character.universe.name}`,
    description: character.summary,
  };
}

export default async function CharacterPage({ params }: Props) {
  const { universe, slug } = await params;
  const character = await getCharacter(universe, slug);
  if (!character) notFound();

  const session = await auth();
  let active = false;
  if (session?.user?.id) {
    const fav = await prisma.favorite.findUnique({
      where: {
        userId_targetType_targetId: {
          userId: session.user.id,
          targetType: FavoriteTarget.CHARACTER,
          targetId: character.id,
        },
      },
    });
    active = Boolean(fav);
  }

  const path = `/u/${universe}/characters/${slug}`;

  return (
    <div className="shell">
      <div className="page-hero">
        <h1>{character.name}</h1>
        <p>{character.summary}</p>
        <div className="chip-row">
          {character.allegiances.map((item) => (
            <span key={item} className="chip">
              {item}
            </span>
          ))}
        </div>
        {session?.user ? (
          <FavoriteButton
            targetType={FavoriteTarget.CHARACTER}
            targetId={character.id}
            path={path}
            active={active}
          />
        ) : null}
      </div>
      <article className="panel prose-lite">
        <p>{character.bio}</p>
      </article>
    </div>
  );
}
