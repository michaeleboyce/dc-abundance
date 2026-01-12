import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Camera, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Image Credits',
  description: 'Attribution for all images used on the DC Abundance website.',
};

const imageCredits = [
  {
    image: 'union-station.jpg',
    title: 'Interior of Union Station DC',
    photographer: 'Pacamah',
    photographerUrl: 'https://commons.wikimedia.org/wiki/User:Pacamah',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Interior_of_Union_Station_DC.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    usage: 'Homepage hero',
  },
  {
    image: 'dc-rowhouses.jpg',
    title: 'DC Street / Sunset in Logan Circle',
    photographer: 'Ted Eytan',
    photographerUrl: 'https://www.flickr.com/photos/taedc/',
    source: 'Flickr',
    sourceUrl: 'https://www.flickr.com/photos/taedc/50518944778',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    usage: 'Housing focus area',
  },
  {
    image: 'u-street-metro.jpg',
    title: 'U Street Metro Station in Washington, DC',
    photographer: 'Alyo',
    photographerUrl: 'https://commons.wikimedia.org/wiki/User:Alyo',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:U_Street_Metro_Station_in_Washington,_DC,_2025.jpg',
    license: 'CC0 1.0 (Public Domain)',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    usage: 'Transportation focus area',
  },
  {
    image: 'dulles-airport.jpg',
    title: 'Washington Dulles International Airport at Dusk',
    photographer: 'Joe Ravi',
    photographerUrl: 'https://commons.wikimedia.org/wiki/User:Jovianeye',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Washington_Dulles_International_Airport_at_Dusk.jpg',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    usage: 'Energy focus area',
  },
  {
    image: 'library-of-congress.jpg',
    title: 'Library of Congress, Washington, D.C.',
    photographer: 'NealVickers',
    photographerUrl: 'https://commons.wikimedia.org/wiki/User:NealVickers',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Library_of_Congress_-_Wash,_DC_10.30.2015_(22).jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    usage: 'Government focus area',
  },
  {
    image: 'haupt-garden.jpg',
    title: 'Enid A. Haupt Garden, Washington, D.C.',
    photographer: 'Another Believer',
    photographerUrl: 'https://commons.wikimedia.org/wiki/User:Another_Believer',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Enid_A._Haupt_Garden,_Washington,_D.C._(2013)_-_02.JPG',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    usage: 'Call to action sections',
  },
  {
    image: 'arena-stage.jpg',
    title: 'Arena Stage at the Mead Center for American Theater',
    photographer: 'Carol M. Highsmith',
    photographerUrl: 'https://www.loc.gov/pictures/collection/highsm/',
    source: 'Library of Congress',
    sourceUrl: 'https://www.loc.gov/item/2010641382',
    license: 'Public Domain',
    licenseUrl: null,
    usage: 'Get Involved page',
  },
  {
    image: 'goddard-space-center.jpg',
    title: 'NASA Goddard Space Flight Center Aerial View',
    photographer: 'NASA Goddard/Bill Hrybyk',
    photographerUrl: 'https://www.flickr.com/photos/gsfc/',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:NASA_Goddard_Space_Flight_Center_Aerial_view_2010_facing_south.jpg',
    license: 'Public Domain (NASA)',
    licenseUrl: null,
    usage: 'Science & Innovation focus area',
  },
];

export default function CreditsPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-primary-900">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Camera className="h-6 w-6 text-accent-400" />
              <span className="text-accent-400 font-medium">Attribution</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Image Credits
            </h1>
            <p className="mt-6 text-xl text-neutral-200 leading-relaxed">
              We're grateful to the photographers who made their work available
              under Creative Commons licenses, allowing us to showcase the beauty
              of Washington, DC.
            </p>
          </div>
        </Container>
      </section>

      {/* Credits List */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="space-y-8">
            {imageCredits.map((credit) => (
              <div
                key={credit.image}
                className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-neutral-800">
                      {credit.title}
                    </h3>
                    <p className="mt-2 text-neutral-600">
                      Photographed by{' '}
                      <a
                        href={credit.photographerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 underline"
                      >
                        {credit.photographer}
                      </a>
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <a
                        href={credit.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View on {credit.source}
                      </a>
                      {credit.licenseUrl ? (
                        <a
                          href={credit.licenseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-500 hover:text-neutral-700"
                        >
                          License: {credit.license}
                        </a>
                      ) : (
                        <span className="text-neutral-500">
                          License: {credit.license}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="md:text-right">
                    <span className="inline-block px-3 py-1 bg-neutral-100 rounded-full text-sm text-neutral-600">
                      Used in: {credit.usage}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modification Notice */}
          <div className="mt-12 p-6 bg-neutral-50 rounded-xl">
            <h3 className="font-semibold text-neutral-800">
              Note on Modifications
            </h3>
            <p className="mt-2 text-neutral-600">
              All images have been resized and compressed for web optimization.
              Per Creative Commons license requirements, these are modified
              versions of the original works. Original images are available at
              the source links provided above.
            </p>
          </div>

          {/* Creative Commons Info */}
          <div className="mt-8 p-6 bg-primary-50 rounded-xl">
            <h3 className="font-semibold text-primary-800">
              About Creative Commons
            </h3>
            <p className="mt-2 text-primary-700">
              Creative Commons licenses allow creators to share their work while
              retaining copyright. The CC BY-SA licenses require attribution and
              that any derivative works be shared under the same license. Learn
              more at{' '}
              <a
                href="https://creativecommons.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                creativecommons.org
              </a>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
