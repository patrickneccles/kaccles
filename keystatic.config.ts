import { config, fields, collection } from "@keystatic/core"

const IMAGES_DIR = {
  directory: "public/images/galleries",
  publicPath: "/images/galleries",
} as const

export default config({
  storage: {
    kind: "github",
    repo: `patrickneccles/kaccles`,
  },
  ui: {
    brand: { name: "Kathy Eccles Photography" },
  },
  collections: {
    galleries: collection({
      label: "Galleries",
      slugField: "title",
      path: "content/galleries/*",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        location: fields.text({
          label: "Location",
          description: 'Where the shoot took place — e.g. "Yellowstone National Park"',
        }),
        subject: fields.text({
          label: "Subject",
          description: 'What you photographed — e.g. "Great Gray Owl"',
        }),
        shootDate: fields.date({
          label: "Shoot date",
          description: "Date of the shoot (not the publish date).",
        }),
        description: fields.text({
          label: "Description",
          description: "Optional short note about this gallery.",
          multiline: true,
        }),
        photos: fields.array(
          fields.object({
            image: fields.image({
              label: "Photo",
              ...IMAGES_DIR,
            }),
            caption: fields.text({
              label: "Caption",
              multiline: false,
            }),
          }),
          {
            label: "Photos",
            description: "Add as many photos as you like. Drag to reorder.",
            itemLabel: (props) => props.fields.caption.value || "Photo",
          }
        ),
      },
    }),
  },
})
