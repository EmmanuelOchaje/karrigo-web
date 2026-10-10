"use client";

import { useState, useTransition } from "react";

import { deleteStorePhoto, uploadStorePhoto } from "@/app/(order)/partners/actions";
import { deleteVerificationPhoto, uploadVerificationPhoto } from "@/app/(order)/my-kitchen/actions";
import { FormError, PhotoUpload } from "@/components/partners/parts";
import type { Schemas } from "@/lib/api/types";
import { VERIFICATION_PHOTOS_REQUIRED } from "@/lib/kitchen/types";

/**
 * The 6 photos ops checks before approving a kitchen. Only the owner can add
 * or remove them (karrigo-be refuses staff), so staff see them read-only.
 * The URLs are signed and short-lived: the page that renders this reads them
 * fresh on every load.
 */
export function VerificationPhotos({
  side,
  photos,
  canEdit,
  failed = false,
}: {
  side: "kitchen" | "store";
  photos: Schemas["VerificationPhotoResponseDto"][];
  canEdit: boolean;
  /** The list could not be read: say so here rather than show "0 of 6". */
  failed?: boolean;
}) {
  const [confirming, setConfirming] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, startTransition] = useTransition();
  const full = photos.length >= VERIFICATION_PHOTOS_REQUIRED;
  const label = side === "kitchen" ? "kitchen" : "store";
  const upload = side === "kitchen" ? uploadVerificationPhoto : uploadStorePhoto;
  const remove = side === "kitchen" ? deleteVerificationPhoto : deleteStorePhoto;

  if (failed) {
    return (
      <p role="alert" className="text-danger-text text-site-label font-semibold">
        Couldn&rsquo;t load your photos — reload to try again.
      </p>
    );
  }

  return (
    <div className="gap-md flex flex-col">
      <p className="text-site-label text-text-secondary">
        Add {VERIFICATION_PHOTOS_REQUIRED} clear photos of your {label}: the front, the work area, storage, and the inside.
      </p>
      <p className="text-site-label font-bold">
        {photos.length} of {VERIFICATION_PHOTOS_REQUIRED} added
      </p>

      {photos.length > 0 && (
        <ul className="gap-md grid grid-cols-2 sm:grid-cols-3">
          {photos.map((photo, index) => (
            <li key={photo.id} className="gap-sm flex flex-col">
              <div className="bg-surface-raised aspect-[4/3] overflow-hidden rounded-panel-xs">
                {/* eslint-disable-next-line @next/next/no-img-element -- a short-lived signed URL; next/image would proxy and cache it. */}
                <img src={photo.url} alt={`${side === "kitchen" ? "Kitchen" : "Store"} photo ${index + 1}`} className="size-full object-cover" />
              </div>
              {canEdit &&
                (confirming === photo.id ? (
                  <div className="gap-sm flex flex-wrap items-center">
                    <span className="text-site-label font-semibold">Remove this photo?</span>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        startTransition(async () => {
                          const result = await remove(photo.id);
                          setConfirming(null);
                          setError(result.ok ? "" : result.error);
                        })
                      }
                      className="text-danger-text text-site-label font-bold disabled:opacity-50"
                    >
                      Yes, remove
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setConfirming(null)}
                      className="text-text-secondary text-site-label font-semibold disabled:opacity-50"
                    >
                      Keep
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setError("");
                      setConfirming(photo.id);
                    }}
                    aria-label={`Remove ${label} photo ${index + 1}`}
                    className="text-text-secondary text-site-label self-start font-semibold disabled:opacity-50"
                  >
                    Remove
                  </button>
                ))}
            </li>
          ))}
        </ul>
      )}

      <FormError>{error}</FormError>

      {canEdit ? (
        <PhotoUpload
          label={`Add a ${label} photo`}
          done={false}
          doneLabel=""
          idleText={full ? "You have all 6 photos. Remove one to swap it." : `${VERIFICATION_PHOTOS_REQUIRED - photos.length} more to add`}
          buttonLabel="Add photo"
          disabled={full}
          upload={upload}
        />
      ) : (
        <p className="text-site-label text-text-secondary">Only the business owner can add or remove these photos.</p>
      )}
    </div>
  );
}
