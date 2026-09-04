"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { PhoneField } from "@/components/ui/PhoneField";
import { OtpInput } from "@/components/ui/OtpInput";
import { ListRow } from "@/components/ui/ListRow";
import { Chip } from "@/components/ui/Chip";
import { BackButton } from "@/components/ui/BackButton";
import { FeatureIcon } from "@/components/ui/FeatureIcon";
import { RestaurantRow } from "@/components/ui/RestaurantRow";
import { Card } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { Sheet } from "@/components/ui/Sheet";
import { Screen } from "@/components/ui/Screen";
import { formatKobo } from "@/lib/money";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-xl">
      <h3 className="text-label text-text-secondary mb-md tracking-[0.09em] uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function Gallery({ mode }: { mode: "light" | "dark" }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <Screen mode={mode} className="relative min-h-[900px] px-screen-x py-xl">
      <Section title="Buttons">
        <div className="gap-sm flex flex-col">
          <Button variant="accent" full>
            Send me a code
          </Button>
          <Button variant="dark" full>
            Order now
          </Button>
          <Button variant="outline" full>
            Change number
          </Button>
          <Button variant="muted" full>
            Not now
          </Button>
          <Button variant="ghost" full>
            Talk to support
          </Button>
          <Button variant="accent" full disabled>
            Disabled
          </Button>
          <div className="gap-sm flex">
            <Button size="sm" variant="accent">
              Find food
            </Button>
            <Button size="sm" variant="outline">
              🛒 0
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Fields">
        <div className="gap-md flex flex-col">
          <TextField
            name="address"
            label="Where should we deliver?"
            placeholder="Behind BSU main gate"
            hint="A landmark is fine. No map pin needed."
          />
          <PhoneField label="Your number" />
          <TextField
            name="promo"
            label="Promo code"
            defaultValue="MAKURD1O"
            error="That code has expired."
          />
        </div>
      </Section>

      <Section title="OTP input">
        <OtpInput />
      </Section>

      <Section title="Chips">
        <div className="gap-sm flex flex-wrap">
          <Chip>Swallow</Chip>
          <Chip tone="selected">Soups</Chip>
          <Chip tone="danger">Busy · 45 min</Chip>
        </div>
      </Section>

      <Section title="Back button and feature icons">
        <div className="gap-md flex items-center">
          <BackButton />
          <FeatureIcon>⌖</FeatureIcon>
          <FeatureIcon tone="muted">💳</FeatureIcon>
          <FeatureIcon tone="danger">!</FeatureIcon>
        </div>
      </Section>

      <Section title="Card">
        <Card>
          <div className="gap-md flex items-start">
            <div className="bg-accent text-on-accent grid size-[30px] shrink-0 place-items-center rounded-[10px] text-sm">
              ⌖
            </div>
            <div>
              <div className="text-h3 font-medium">Behind BSU main gate</div>
              <div className="text-caption text-text-secondary mt-xs">
                High Level · 2.1 km away
              </div>
            </div>
            <span className="text-caption text-accent-text ml-auto font-medium">
              Change
            </span>
          </div>
        </Card>
      </Section>

      <Section title="List rows">
        <div>
          <ListRow
            title="Order updates"
            description="Cooking, picked up, arriving"
            trailing={<Toggle label="Order updates" defaultChecked />}
          />
          <ListRow
            title="Rider is at your gate"
            description="Also rings your phone"
            trailing={<Toggle label="Rider is at your gate" defaultChecked />}
          />
          <ListRow
            title="Offers and promo codes"
            trailing={<Toggle label="Offers and promo codes" />}
          />
          <ListRow title="Saved addresses" description="3 saved" href="#" />
        </div>
      </Section>

      <Section title="Restaurant rows">
        <div>
          <RestaurantRow
            href="#"
            name="Terkimbi's Kitchen"
            cuisine="Swallow · Soups · Rice"
            thumbnail="🍲"
            distanceKm={2.1}
            etaMinutes={25}
            deliveryFeeKobo={50000}
            tags={[{ label: "Free delivery", tone: "free" }]}
          />
          <RestaurantRow
            href="#"
            name="Mama Doo Rice"
            cuisine="Rice · Grills"
            thumbnail="🍚"
            distanceKm={3.4}
            etaMinutes={35}
            deliveryFeeKobo={0}
            tags={[
              { label: "New", tone: "new" },
              { label: "Busy", tone: "busy" },
            ]}
          />
          <RestaurantRow
            href="#"
            name="Benue Pepper Soup Joint"
            cuisine="Pepper soup · Catfish"
            thumbnail="🐟"
            distanceKm={5.8}
            etaMinutes={45}
            deliveryFeeKobo={80000}
            closedLabel="Opens tomorrow at 10:00"
          />
        </div>
      </Section>

      <Section title="Type scale">
        <div className="gap-sm flex flex-col">
          <p className="text-display">Makurdi eats. We deliver.</p>
          <p className="text-h1">Enter your code</p>
          <p className="text-h2">Terkimbi&apos;s Kitchen</p>
          <p className="text-h3">Catfish pepper soup</p>
          <p className="text-body text-text-secondary">
            Fresh Benue river catfish, scent leaf, and a broth that will clear your head.
          </p>
          <p className="text-label text-text-secondary">DELIVER TO</p>
          <p className="text-caption text-text-tertiary">
            By continuing you agree to M-Kart&apos;s Terms and Privacy Policy.
          </p>
          <p className="text-price">{formatKobo(350000)}</p>
        </div>
      </Section>

      <Section title="Sheet">
        <Button variant="outline" full onClick={() => setSheetOpen(true)}>
          Open sheet
        </Button>
      </Section>

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Start a new cart?"
      >
        <p className="text-body text-text-secondary mb-lg">
          Your cart has food from Terkimbi&apos;s Kitchen. One kitchen per order, so
          adding from Mama Doo Rice will clear it.
        </p>
        <div className="gap-sm flex flex-col">
          <Button variant="accent" full onClick={() => setSheetOpen(false)}>
            Start a new cart
          </Button>
          <Button variant="ghost" full onClick={() => setSheetOpen(false)}>
            Keep my cart
          </Button>
        </div>
      </Sheet>
    </Screen>
  );
}
